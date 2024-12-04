import Display from "@/components/ui/display";

export default function Home() {
  return (
    <section className="relative min-h-screen w-full grid">
      <div className="absolute self-center mx-auto w-full text-center font-bold block md:hidden">
        <h1>{`Gunakan laptop untuk melihat web :D`}</h1>
      </div>
      <div className="hidden md:block">
        <Display />
      </div>
    </section>
  );
}
