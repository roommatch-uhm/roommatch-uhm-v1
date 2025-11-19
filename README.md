<img src="https://roommatch-uhm.vercel.app/_next/image?url=%2Fimages%2Flogo-option-1.png&w=640&q=75" width="200px">

<h1>RoomMatch-UHM</h1>

<p>
RoomMatch-UHM is a roommate-matching web application designed for UH Mānoa students.
Users create lifestyle profiles, browse other students' profiles, and compare preferences
such as cleanliness, study habits, sleep schedule, budget, and social style.
The project uses Next.js, React Bootstrap, Prisma, and NextAuth, and is deployed on Vercel.
</p>

<p>Live Site: <a href="https://roommatch-uhm.vercel.app/view">https://roommatch-uhm.vercel.app/view</a></p>

<hr />

<h2>Features</h2>

<h3>Profile Creation</h3>
<ul>
  <li>Name</li>
  <li>Profile image</li>
  <li>Personal description</li>
  <li>Cleanliness preference</li>
  <li>Study habits</li>
  <li>Social style</li>
  <li>Sleep schedule</li>
  <li>Budget range</li>
</ul>

<h3>View All Profiles</h3>
<p>
Profiles are displayed in a grid using reusable <code>ProfileCard</code> components.
</p>

<h3>Compatibility</h3>
<p>
A compatibility algorithm will be implemented to score how well two users match based on their traits.
</p>

<h3>Chat with Matches</h3>
<p>
Messaging platform to connect potential matches to each other.
</p>

<h3>Authentication</h3>
<ul>
  <li>Secure login for UH students only</li>
  <li>Profile creation and viewing require authentication</li>
</ul>

<h3>Modern Tooling</h3>
<ul>
  <li>Next.js App Router</li>
  <li>React Bootstrap</li>
  <li>Prisma ORM</li>
  <li>PostgreSQL</li>
  <li>Deployed with Vercel</li>
</ul>

<hr />

<h2>How It Works</h2>

<ol>
  <li>Users authenticate through NextAuth.</li>
  <li>Users create a profile with lifestyle preferences defined by Prisma enums.</li>
  <li>Users browse all profiles through the RoomMatches page.</li>
</ol>

<hr />

<h2>Tech Stack</h2>

<table>
  <tr><th>Category</th><th>Tools</th></tr>
  <tr><td>Frontend</td><td>Next.js 14, React Bootstrap</td></tr>
  <tr><td>Backend</td><td>Next.js Server Components, API Routes</td></tr>
  <tr><td>Database</td><td>PostgreSQL + Prisma ORM</td></tr>
  <tr><td>Authentication</td><td>NextAuth</td></tr>
  <tr><td>Deployment</td><td>Vercel</td></tr>
</table>

<hr />

<h2>Project Structure</h2>

<pre>
src/
 ├── app/
 │   ├── add/
 │   ├── create/
 │   ├── list/
 │   ├── api/
 │   └── layout.tsx
 ├── components/
 │   ├── CreateProfile.tsx
 │   ├── ProfileCard.tsx
 │   └── Navbar.tsx
 ├── lib/
 │   ├── prisma.ts
 │   ├── dbActions.ts
 │   └── validationSchemas.ts
 └── prisma/
      └── schema.prisma
</pre>

<hr />

<h2>Database Schema</h2>

<h3>Profile Model</h3>

<pre>
model Profile {
  id            Int       @id @default(autoincrement())
  image         String
  name          String
  description   String
  clean         Clean       @default(messy)
  budget        Budget      @default($300-$599/month)
  social        Social      @default(keep to myself)
  study         Study       @default(constant focus)  
  sleep         Sleep       @default(night owl)
}
</pre>

<h3>Enums</h3>
<ul>
  <li>Clean</li>
  <li>Social</li>
  <li>Sleep</li>
  <li>Budget</li>
  <li>Study</li>
</ul>

<hr />

<h2>Getting Started (Development)</h2>

<h3>1. Install Dependencies</h3>
<pre>npm install</pre>

<h3>2. Create Environment Variables</h3>
<pre>
DATABASE_URL="your-postgres-url"
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"
</pre>

<h3>3. Run Prisma Migrations</h3>
<pre>npx prisma migrate dev</pre>

<h3>4. Start Development Server</h3>
<pre>npm run dev</pre>

<hr />
