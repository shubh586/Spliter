
import { getAllContacts } from "@/lib/controllers/contacts"

const page = async() => {
    const users = await getAllContacts()
    console.log(users)
  return (
    <div>page</div>
  )
}

export default page