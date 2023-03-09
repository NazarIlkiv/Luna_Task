import Link from "next/link";

const NotFoundPage = () => {
  return (
    <div className="not-found">
      <h1 className="not-found__title">Ops....</h1>
      <h2 className="not-found__text">Page not found</h2>
      <p className="not-found__link">
        Go to{" "}
        <Link href="/">
          <b>Home</b>
        </Link>
      </p>
    </div>
  );
};

export default NotFoundPage;

export {};
