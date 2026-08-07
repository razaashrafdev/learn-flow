export function AuthAside() {
  return (
    <aside className="relative hidden overflow-hidden bg-primary lg:flex lg:items-center lg:justify-center">
      <div className="absolute inset-0 opacity-20 [background:radial-gradient(60%_50%_at_20%_20%,white,transparent),radial-gradient(50%_50%_at_85%_75%,white,transparent)]" />
      <div className="relative z-10 flex w-full h-full items-center justify-center p-10">
        <img
          src="/vector.png"
          alt=""
          className="w-full h-full object-contain max-h-[80vh]"
        />
      </div>
    </aside>
  );
}
