import { User } from '@prisma/client';
import Link from 'next/link';

/* Renders a single row in the List Users table. */
const UserItem = ({ id, firstName, lastName, UHemail, roommateStatus, budget }: User) => (
  <tr>
    <td>{firstName}</td>
    <td>{lastName}</td>
    <td>{UHemail}</td>
    <td>{roommateStatus}</td>
    <td>{budget}</td>
    <td>
      <Link href={`/edit/${id}`}>Edit</Link>
    </td>
  </tr>
);

export default UserItem;
