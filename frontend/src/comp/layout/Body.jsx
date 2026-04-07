import Header from "./Header/Header";
import Footer from "./Footer/Footer";
import { useLocation } from "react-router";
import { TimerIcon } from "../ui/Icons";
import { Bot } from "lucide-react";
import { Card } from "../ui/TopCard";
import { Link } from "react-router";
import { Outlet } from "react-router";
export default function Body() {
  const location=useLocation()
  return (
    <div>
      <Header  />
      <div className="main-background">

      <Outlet/>

    {location.pathname!=='/'&&(
      <>
    {/* Bottom Left */}
{location.pathname !=='/dashboard/timer' && (

  <Link to='/dashboard/timer'>
<div className="fixed bottom-6 left-6 z-50 cursor-pointer group">
  <Card variant="dark" className=" p-5 rounded-full transition-all duration-300
    hover:scale-110 hover:brightness-125 ">
    <TimerIcon className="text-white drop-shadow-lg w-6 h-6" />
  </Card>
</div>
</Link>)}

{location.pathname!=='/dashboard/ai' && (<Link to="/dashboard/ai">
{/* Bottom Right */}
<div className="fixed bottom-6 right-6 z-50 cursor-pointer group">
  <Card variant="dark"  className=" p-5 rounded-full transition-all duration-200
    hover:scale-110 hover:brightness-125 ">
    <Bot className="text-white drop-shadow-lg w-6 h-6" />
  </Card>
</div>
      </Link>)}
      </> 
    )}
      </div>
      <Footer />
   
    </div>
  );
}
