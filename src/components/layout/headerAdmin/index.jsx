export default function HeaderAdmin({ title, desc, action }) {
  return (
    <div
      className={`flex items-center px-8 mt-6 gap-2 font-schibsted-grotesk ${
        action && "justify-between"
      }`}
    >
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-semibold bg-cyan-sky text-transparent bg-clip-text">
          {title}
        </h1>
        <p className="text-neutral-700">{desc}</p>
      </div>
      {action && action}
    </div>
  );
}
