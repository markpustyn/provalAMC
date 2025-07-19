import { NavUser } from "@/components/nav-user"


const user = [
  {
    name: 'Mark Pustynovich',
    email: 'mark@example.com',
    avatar: 'https://i.pravatar.cc/150?img=3',
  },
  {
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    avatar: 'https://i.pravatar.cc/150?img=5',
  },
  {
    name: 'John Smith',
    email: 'john.smith@example.com',
    avatar: 'https://i.pravatar.cc/150?img=8',
  },
  {
    name: 'Emily Johnson',
    email: 'emily.j@example.com',
    avatar: 'https://i.pravatar.cc/150?img=10',
  },
];




export default function page() {
  return (
    <div>client page
      <NavUser user={user[0]}/>
    </div>
  )
}
