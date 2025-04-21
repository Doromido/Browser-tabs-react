import { BiCartAlt, BiGrid, BiPhone, BiHelpCircle, BiListCheck } from "react-icons/bi";
import { BsBank2, BsBoxSeam, BsCalculator, BsFileEarmarkText, BsGraphUp, BsEnvelope } from "react-icons/bs";
import { AiOutlineShop, AiOutlineSetting } from "react-icons/ai";
import { FaWarehouse } from "react-icons/fa";
import App from "../App";

function Tabs() {
  const baseTabs = [
    { label: "Dashboard", url: "/dashboard", content: {}, icon: <BiGrid size={18} /> },
    { label: "Banking", url: "/banking", content: {}, icon: <BsBank2 size={18} /> },
    { label: "Telefonie", url: "/telefonie", content: {}, icon: <BiPhone size={18} /> },
    { label: "Accounting", url: "/accounting", content: {}, icon: <BsCalculator size={18} /> },
    { label: "Verkauf", url: "/verkauf", content: {}, icon: (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
    </svg>
    ) },
    { label: "Statistik", url: "/statistik", content: {}, icon: <BsGraphUp size={18} /> },
    { label: "Post Office", url: "/post-office", content: {}, icon: <BsEnvelope size={18} /> },
    { label: "Administration", url: "/administration", content: {}, icon: <AiOutlineSetting size={18} /> },
    { label: "Help", url: "/help", content: {}, icon: <BiHelpCircle size={18} /> },
    { label: "Warenbestand", url: "/warenbestand", content: {}, icon: <BsBoxSeam size={18} /> },
    { label: "Auswahllisten", url: "/auswahllisten", content: {}, icon: <BiListCheck size={18} /> },
    { label: "Einkauf", url: "/einkauf", content: {}, icon: <BiCartAlt size={18} /> },
    { label: "Rechn", url: "/rechn", content: {}, icon: <BsFileEarmarkText size={18} /> },
    { label: "Lagerverwaitung", url: "/lagerverwaitung", content: {}, icon: <FaWarehouse size={18} /> },
  ];

  const tabsWithPinned = baseTabs.map((tab) => ({ ...tab, pinned: false }));

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8 text-gray-900">
      <App tabs={tabsWithPinned} />
    </div>
  );
}export default Tabs;