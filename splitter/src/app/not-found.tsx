import Link from 'next/link'

export default function NotFound() {
  return (
    <div className='bg-black flex-col items-center gap-3 p-8 h-screen justify-center'>
      <h2 className='mt-8 text-xl text-yellow-200 '>Not Found</h2>
      <p className='mt-2 text-xl text-yellow-200 '>Could not find requested resource</p>
      <Link href="/">Return Home</Link>
    </div>
  )
}
