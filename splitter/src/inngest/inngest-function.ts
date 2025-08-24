import { inngest } from "./client";
import {
  getUsersWithExpenses,
  getUserMonthlyExpenses,
  getUsersWithOutstandingDebts,
} from "@/lib/query";
import { sendEmail } from "@/lib/email";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Gemini setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Common result type
type JobResult = {
  userId: string;
  success: boolean;
  error?: string;
  skipped?: boolean;
};

export const spendingInsights = inngest.createFunction(
  { name: "Generate Spending Insights", id: "generate-spending-insights" },
  { cron: "0 8 1 * *" },
  async ({ step }) => {
    const users = await step.run("Fetch users", getUsersWithExpenses);
    const results: JobResult[] = [];

    for (const user of users) {
      const expenses = await step.run(`Expenses ${user.id}`, () =>
        getUserMonthlyExpenses(user.id)
      );
      if (!expenses?.length) {
        results.push({ userId: user.id, success: false, skipped: true });
        continue;
      }

      const expenseData = {
        expenses,
        totalSpent: expenses.reduce((sum, e) => sum + e.amount, 0),
        categories: expenses.reduce<Record<string, number>>((cats, e) => {
          const cat = e.category ?? "uncategorised";
          cats[cat] = (cats[cat] ?? 0) + e.amount;
          return cats;
        }, {}),
      };

      const prompt = `
As a financial analyst, review this user's spending data and provide insights.
Format as HTML with sections:
1. Monthly Overview
2. Top Categories
3. Unusual Spending
4. Saving Opportunities
5. Recommendations

User data:
${JSON.stringify(expenseData)}
      `.trim();

      try {
        const aiResponse = await step.ai.wrap(
          "gemini",
          async (p: string) => model.generateContent(p),
          prompt
        );
      const firstPart = aiResponse?.response?.candidates?.[0]?.content?.parts?.[0];
      const htmlBody = firstPart && "text" in firstPart ? firstPart.text : "";
        await step.run(`Email ${user.id}`, () =>
          sendEmail({
            to: user.email,
            subject: "Your Monthly Spending Insights",
            html: `
              <h1>Your Monthly Financial Insights</h1>
              <p>Hi ${user.name},</p>
              ${htmlBody}
            `,
          })
        );

        results.push({ userId: user.id, success: true });
      } catch (err) {
        results.push({
          userId: user.id,
          success: false,
          error: (err as Error).message,
        });
      }
    }

    return {
      processed: results.length,
      successes: results.filter((r) => r.success).length,
      failures: results.filter((r) => r.success === false).length,
      skipped: results.filter((r) => r.skipped).length,
    };
  }
);


export const paymentReminders = inngest.createFunction(
  { id: "send-payment-reminders" },
  { cron: "0 10 * * *" }, // daily 10 AM UTC
  async ({ step }) => {
    const users = await step.run("Fetch debts", getUsersWithOutstandingDebts);

    const results: JobResult[] = await step.run("Send emails", async () =>
      Promise.all(
        users.map(async (u) => {
          const rows = u.debts
            .map(
              (d) => `
                <tr>
                  <td>${d.name}</td>
                  <td>$${d.amount.toFixed(2)}</td>
                </tr>
              `
            )
            .join("");

          if (!rows) return { userId: u.id, success: false, skipped: true };

          const html = `
            <h2>Splitr – Payment Reminder</h2>
            <p>Hi ${u.name}, you owe:</p>
            <table border="1" cellspacing="0" cellpadding="4">
              <thead><tr><th>To</th><th>Amount</th></tr></thead>
              <tbody>${rows}</tbody>
            </table>
          `;

          try {
            await sendEmail({
              to: u.email,
              subject: "Pending payments on Splitr",
              html,
            });
            return { userId: u.id, success: true };
          } catch (err) {
            return {
              userId: u.id,
              success: false,
              error: (err as Error).message,
            };
          }
        })
      )
    );

    return {
      processed: results.length,
      successes: results.filter((r) => r.success).length,
      failures: results.filter((r) => r.success === false).length,
      skipped: results.filter((r) => r.skipped).length,
    };
  }
);
