import { faCarRear } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  KeySquare,
  LayoutPanelLeft,
} from "lucide-react";

export const PetugasMenu = {
  navMain: [
    {
      title: "Dashboard",
      url: "/petugas/dashboard",
      icon: <LayoutPanelLeft />,
    },
    {
      title: "Kendaraan",
      url: "/petugas/kendaraan",
      icon: <FontAwesomeIcon icon={faCarRear} />,
    },
    {
      title: "Penyewaan",
      url: "/petugas/penyewaan",
      icon: <KeySquare />,
    },
  ],
};

export default PetugasMenu;
