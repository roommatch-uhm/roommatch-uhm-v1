import { getServerSession } from 'next-auth';
import authOptions from '@/lib/authOptions';
import { loggedInProtectedPage } from '@/lib/page-protection';
import AddStuffForm from '@/components/AddUserForm';

const AddStuff = async () => {
  // Protect the page, only logged in users can access it.
  const session = await getServerSession(authOptions);
  loggedInProtectedPage(
    session as any,
  );
  return (
    <main>
      <AddStuffForm />
    </main>
  );
};

export default AddStuff;
