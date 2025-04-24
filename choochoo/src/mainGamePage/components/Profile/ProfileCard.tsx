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
  return (
    <div
      className={mainPlayer ? "main_player_card" : "player_card"}
      data-active={active}
    >
      <img
        className="profile_pic"
        src={profilePic}
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
