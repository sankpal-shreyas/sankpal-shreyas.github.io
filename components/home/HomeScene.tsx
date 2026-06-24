import { HeroTunnelScene } from "@/components/home/HeroTunnelScene";
import { WarRoom } from "@/components/home/WarRoom";
import { HomeCtas } from "@/components/home/HomeCtas";

export function HomeScene() {
  return (
    <>
      <HeroTunnelScene />
      <WarRoom />
      <HomeCtas />
    </>
  );
}
