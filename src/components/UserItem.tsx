import { User } from '@prisma/client';
import Link from 'next/link';

/* Renders a single row in the List Users table. */
const UserItem = ({ id, UHemail, roommateStatus, budget }: User) => (
  <tr>
    <td>{UHemail}</td>
    <td>{roommateStatus}</td>
    <td>{budget}</td>
    <td>
      <Link href={`/edit/${id}`}>Edit</Link>
    </td>
  </tr>
);

export default UserItem;
