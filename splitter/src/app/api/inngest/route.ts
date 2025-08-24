import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import {
  paymentReminders,
  spendingInsights,
} from "@/inngest/inngest-function"


// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    spendingInsights,
    paymentReminders,
  ],
});
