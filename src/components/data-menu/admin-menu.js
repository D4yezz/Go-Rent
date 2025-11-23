import { faCarRear } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  FileChartColumn,
  Frame,
  KeySquare,
  LayoutPanelLeft,
  LogOut,
  Map,
  PieChart,
  Users,
} from "lucide-react";

export const AdminMenu = {
  navMain: [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: <LayoutPanelLeft />,
    },
    {
      title: "Kendaraan",
      url: "/admin/kendaraan",
      icon: <FontAwesomeIcon icon={faCarRear} />,
    },
    {
      title: "Pemesanan",
      url: "/admin/order",
      icon: <KeySquare />,
    },
    {
      title: "Pengguna",
      url: "/admin/users",
      icon: <Users />,
    },
    {
      title: "Laporan",
      url: "/admin/reports",
      icon: <FileChartColumn />,
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};

export default AdminMenu;
