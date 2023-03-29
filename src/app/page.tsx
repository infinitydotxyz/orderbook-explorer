"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/dashboard");
  });

  return (
    <div>
      <h1>FLOW!</h1>
    </div>
  );
}

export default Home;
