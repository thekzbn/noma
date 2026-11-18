import Link from "next/link";
import Image from "next/image";

const stories = [
  {
    number: "01",
    title: "A goal of my own",
    quote: "I want to save for a course and keep the goal private while I work toward it.",
    detail: "Set a personal goal, then decide who can see it or take part. Access is yours to choose.",
    href: "/sign-up",
    link: "Explore personal saving",
  },
  {
    number: "02",
    title: "A plan we share",
    quote: "We’re saving for a move. Everyone should know the target, the contribution plan, and who can approve a payout.",
    detail: "Agree on the rules together. Being a member does not automatically grant permission to move money.",
    href: "/sign-up",
    link: "Explore shared saving",
  },
  {
    number: "03",
    title: "A cause I support",
    quote: "I want to support a campaign without joining the organiser’s private space.",
    detail: "Guest contributions stay separate from membership. A payment is only confirmed when the provider verifies it.",
    href: "/campaign/campaign-1",
    link: "Explore campaigns",
  },
];

const steps = [
  "Name the thing that matters",
  "Choose who can see or take part",
  "Set the contribution and access rules",
  "Keep the record with the goal",
];

function Wordmark() {
  return <span className="text-2xl font-bold tracking-tight text-[#1F4591]">noma<span className="text-[#2B6AD0]">.</span></span>;
}

export default function Home() {
  return (
    <main id="main-content" className="bg-white text-[#061E47]">
      <header className="border-b border-[#E2E8F0] bg-white">
        <div className="mx-auto flex min-h-[76px] max-w-[1184px] items-center justify-between gap-5 px-5 lg:px-0">
          <Link href="/" aria-label="Noma home"><Wordmark /></Link>
          <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
            <Link className="text-sm text-[#4A5568] hover:text-[#2B6AD0]" href="/how-it-works">How it works</Link>
            <a className="text-sm text-[#4A5568] hover:text-[#2B6AD0]" href="#saving-together">Saving together</a>
            <a className="text-sm text-[#4A5568] hover:text-[#2B6AD0]" href="#campaigns">Campaigns</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link className="hidden px-2 py-2 text-sm font-medium text-[#1F4591] sm:inline" href="/sign-in">Log in</Link>
            <Link className="inline-flex min-h-11 items-center rounded-md bg-[#2B6AD0] px-4 text-sm font-semibold text-white hover:bg-[#1F4591]" href="/sign-up">Get started</Link>
          </div>
        </div>
      </header>

      <section className="relative flex min-h-[540px] items-center overflow-hidden bg-[#102B55] sm:min-h-[600px] lg:min-h-[650px]">
        <Image
          src="/noma-savings-planning.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_43%]"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-[#061E47]/65" aria-hidden="true" />
        <div className="relative mx-auto w-full max-w-[1184px] px-5 py-20 lg:px-0">
          <div className="max-w-[650px]">
            <h1 style={{ color: "#fff" }} className="max-w-[520px] text-5xl font-semibold leading-[1.06] tracking-[-0.04em] sm:text-6xl lg:text-[3.75rem]">Make room for what matters.</h1>
            <p className="mt-7 max-w-[520px] text-lg leading-8 text-white">A savings space for your next step, the people beside you, or a cause you care about.</p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Link className="inline-flex min-h-11 items-center gap-2 rounded-sm bg-[#0874E8] px-5 text-sm font-semibold text-white hover:bg-[#1F4591]" href="/sign-up">Start a savings space <span aria-hidden="true">→</span></Link>
              <Link className="text-sm font-semibold text-white underline underline-offset-4 hover:text-blue-100" href="/campaign/campaign-1">See a campaign <span aria-hidden="true">→</span></Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#EFF6FD] px-5 py-16 sm:py-20">
        <div className="mx-auto max-w-[1184px]">
          <p className="text-sm font-semibold text-[#2B6AD0]">Illustrative user stories</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.025em] sm:text-4xl">Start with what matters to you.</h2>
          <p className="mt-4 max-w-2xl leading-7 text-[#4A5568]">A personal goal, a plan with your people, or a cause you care about. Each starts with a different need.</p>
          <div className="mt-9 divide-y divide-[#B9D3F1] border-y border-[#B9D3F1]">
            {stories.map((story) => (
              <article key={story.number} className="grid gap-5 py-7 md:grid-cols-[0.8fr_1.5fr_0.7fr] md:items-start md:gap-10 md:py-9">
                <div className="flex items-baseline gap-4">
                  <span className="text-sm font-semibold text-[#2B6AD0]">{story.number}</span>
                  <h3 className="text-xl font-semibold">{story.title}</h3>
                </div>
                <div>
                  <blockquote className="text-lg leading-7 text-[#18345C]">“{story.quote}”</blockquote>
                  <p className="mt-3 text-sm leading-6 text-[#4A5568]">{story.detail}</p>
                </div>
                <Link className="text-sm font-semibold text-[#1F4591] underline decoration-[#9DBCE4] underline-offset-4 hover:text-[#2B6AD0]" href={story.href}>{story.link} →</Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:py-20">
        <div className="mx-auto grid max-w-[1184px] gap-10 lg:grid-cols-2 lg:gap-20">
          <div>
            <h2 className="max-w-lg text-3xl font-semibold tracking-[-0.025em] sm:text-4xl">One space. One clear purpose.</h2>
            <p className="mt-4 max-w-lg leading-7 text-[#4A5568]">Start with what you are saving for. Keep the goal, people, rules and money records together.</p>
            <Link className="mt-7 inline-flex min-h-11 items-center rounded-md bg-[#2B6AD0] px-5 font-semibold text-white hover:bg-[#1F4591]" href="/sign-up">Choose a space</Link>
          </div>
          <ol className="border-y border-[#CBD5E0]">
            {steps.map((step, i) => <li key={step} className="flex min-h-[62px] items-center gap-5 border-b border-[#E2E8F0] last:border-0"><span className="text-sm font-semibold text-[#2B6AD0]">0{i + 1}</span><span className="font-medium">{step}</span></li>)}
          </ol>
        </div>
      </section>

      <section id="saving-together" className="scroll-mt-8 bg-[#EFF6FD] px-5 py-16 sm:py-20">
        <div className="mx-auto grid max-w-[1184px] gap-10 lg:grid-cols-2 lg:gap-20">
          <div>
            <h2 className="max-w-xl text-3xl font-semibold tracking-[-0.025em] sm:text-4xl">Save by yourself. Bring your people in when you are ready.</h2>
            <p className="mt-4 max-w-xl leading-7 text-[#4A5568]">A personal goal stays yours. A shared goal has its own members and rules. The people close to you only get the access you choose.</p>
            <ul className="mt-7 divide-y divide-[#C9DDF4] border-y border-[#C9DDF4]">
              {[["View progress", "can be granted separately"], ["Contribute", "can be granted separately"], ["Edit details", "never assumed"], ["Approve or withdraw", "never assumed"]].map(([label, note]) => <li key={label} className="flex items-center gap-3 py-3 text-sm"><span aria-hidden="true" className="font-semibold text-[#2B6AD0]">✓</span><span className="font-medium">{label}</span><span className="text-[#718096]">{note}</span></li>)}
            </ul>
          </div>
          <div className="divide-y divide-[#B9D3F1] border-y border-[#B9D3F1]">
            <article className="py-6 sm:py-7"><h3 className="text-lg font-semibold">Personal saving</h3><p className="mt-2 text-sm leading-6 text-[#4A5568]">A private goal with control that stays with you.</p><Link className="mt-4 inline-block text-sm font-semibold text-[#1F4591] underline underline-offset-4" href="/sign-up">See a personal space →</Link></article>
            <article className="py-6 sm:py-7"><h3 className="text-lg font-semibold">Shared saving</h3><p className="mt-2 text-sm leading-6 text-[#4A5568]">One goal, clear contributions and agreed payout rules.</p><Link className="mt-4 inline-block text-sm font-semibold text-[#1F4591] underline underline-offset-4" href="/sign-up">See a shared space →</Link></article>
          </div>
        </div>
      </section>

      <section id="campaigns" className="scroll-mt-8 px-5 py-14 sm:py-16">
        <div className="mx-auto flex max-w-[1184px] flex-col gap-4 border-b border-[#E2E8F0] pb-12 sm:flex-row sm:items-end sm:justify-between">
          <div><h2 className="text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">Giving to a campaign?</h2><p className="mt-3 max-w-2xl leading-7 text-[#4A5568]">Open a public campaign and contribute as a guest. You do not need to join the organiser’s space.</p></div>
          <Link className="shrink-0 text-sm font-semibold text-[#1F4591] underline underline-offset-4" href="/campaign/campaign-1">Explore the campaign page →</Link>
        </div>
      </section>

      <footer className="px-5">
        <div className="mx-auto flex max-w-[1184px] flex-col gap-4 py-7 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" aria-label="Noma home"><Wordmark /></Link>
          <p className="text-sm text-[#718096]">Personal and shared saving should be simple and free.</p>
          <Link className="text-sm font-medium text-[#1F4591] hover:text-[#2B6AD0]" href="/sign-in">Log in</Link>
        </div>
      </footer>
    </main>
  );
}
