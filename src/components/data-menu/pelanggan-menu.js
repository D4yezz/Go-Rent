import { Cog, History, LayoutPanelLeft } from "lucide-react";

export const PelangganMenu = {
  navMain: [
    {
      title: "Dashboard",
      url: "/pelanggan/dashboard",
      icon: <LayoutPanelLeft />,
    },
    {
      title: "Riwayat Sewa",
      url: "/pelanggan/riwayat",
      icon: <History />,
    },
    {
      title: "Pengaturan Akun",
      url: "/pelanggan/settings",
      icon: <Cog />,
    },
  ],
};

export default PelangganMenu;
