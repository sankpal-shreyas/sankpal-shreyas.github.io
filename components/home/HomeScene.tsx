import { Hero } from "@/components/home/Hero";
import { Tunnel } from "@/components/home/Tunnel";
import { WarRoom } from "@/components/home/WarRoom";
import { HomeCtas } from "@/components/home/HomeCtas";

export function HomeScene() {
  return (
    <>
      <Hero />
      <Tunnel />
      <WarRoom />
      <HomeCtas />
    </>
  );
}
