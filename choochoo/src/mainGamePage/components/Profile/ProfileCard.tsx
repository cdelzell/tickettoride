import "./ProfileCard.css";
import { profileImages } from "@/imageImports";

function PlayerCard({
  username,
  trainCount,
  profilePic,
  mainPlayer,
  active,
}: {
  username: string;
  trainCount: number;
  profilePic: string;
  mainPlayer: boolean;
  active: boolean;
}) {
  // 🔧 Normalize input: extract filename and strip extension
  const raw = profilePic.split("/").pop() || "default";
  const key = raw.split(".")[0].toLowerCase(); // e.g., "george.jpg" => "george"

  const imgSrc = profileImages[key] ?? profileImages["default"];

  return (
    <div
      className={mainPlayer ? "main_player_card" : "player_card"}
      data-active={active}
    >
      <img
        className="profile_pic"
        src={imgSrc}
        alt={`Profile of ${username}`}
      />
      <div className="player_info">
        <span className="username">{username}</span>
        <span className="train_count">{trainCount} Trains</span>
      </div>
    </div>
  );
}

export default PlayerCard;
