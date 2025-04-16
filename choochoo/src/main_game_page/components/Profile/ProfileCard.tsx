import "./ProfileCard.css";

// Import all profile images
import arthur from "@/assets/Profile_Images/arthur.jpg";
import buddy from "@/assets/Profile_Images/buddy.webp";
import clifford from "@/assets/Profile_Images/clifford.jpg";
import Default_pfp from "@/assets/Profile_Images/Default_pfp.jpg";
import dw from "@/assets/Profile_Images/dw.webp";
import emily_train from "@/assets/Profile_Images/emily_train.webp";
import george from "@/assets/Profile_Images/george.jpg";
import gordon_train from "@/assets/Profile_Images/gordon_train.webp";
import henry_train from "@/assets/Profile_Images/henry_train.webp";
import james_train from "@/assets/Profile_Images/james_train.webp";
import shiny from "@/assets/Profile_Images/shiny.webp";
import thomas_train from "@/assets/Profile_Images/thomas_train.jpg";

// Create a map of filenames to image imports
const profileImages: Record<string, string> = {
  "arthur.jpg": arthur,
  "buddy.webp": buddy,
  "clifford.jpg": clifford,
  "Default_pfp.jpg": Default_pfp,
  "dw.webp": dw,
  "emily_train.webp": emily_train,
  "george.jpg": george,
  "gordon_train.webp": gordon_train,
  "henry_train.webp": henry_train,
  "james_train.webp": james_train,
  "shiny.webp": shiny,
  "thomas_train.jpg": thomas_train,
};

function PlayerCard({
  username,
  trainCount,
  profilePic,
  main_player,
}: {
  username: string;
  trainCount: number;
  profilePic: string; // Ex: "src/assets/Profile_Images/arthur.jpg"
  main_player: boolean;
  active: boolean;
}) {
  // Extract the file name from the path
  const filename = profilePic.split("/").pop() || "Default_pfp.jpg";

  // Use imported image if available, else fallback
  const imgSrc = profileImages[filename] ?? Default_pfp;
  console.log("ProfilePic:", imgSrc);


  return (
    <div className={main_player ? "main_player_card" : "player_card"}>
      <img className="profile_pic" src={imgSrc} alt={`Profile of ${username}`} />
      <div className="player_info">
        <span className="username">{username}</span>
        <span className="train_count">{trainCount} Trains</span>
      </div>
    </div>
  );
}

export default PlayerCard;