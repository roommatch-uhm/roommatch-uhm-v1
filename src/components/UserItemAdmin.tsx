import { User } from '@prisma/client';

/* Renders a single row in the List Users table for admin view. */
const UserItemAdmin = ({ id, UHemail, role, roommateStatus, budget }: User) => (
  <tr>
    <td>{UHemail}</td>
    <td>{role}</td>
    <td>{roommateStatus}</td>
    <td>{budget}</td>
    <td>
      <a href={`/edit/${id}`}>Edit</a>
    </td>
  </tr>
);

export default UserItemAdmin;
