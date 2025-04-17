import "./ProfileCard.css";
import { profileImages } from "@/image_imports";

function PlayerCard({
  username,
  trainCount,
  profilePic,
  main_player,
}: {
  username: string;
  trainCount: number;
  profilePic: string;
  main_player: boolean;
  active: boolean;
}) {
  // 🔧 Normalize input: extract filename and strip extension
  const raw = profilePic.split("/").pop() || "default";
  const key = raw.split(".")[0].toLowerCase(); // e.g., "george.jpg" => "george"

  const imgSrc = profileImages[key] ?? profileImages["default"];

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
