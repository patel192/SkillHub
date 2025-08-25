import React, { useState } from "react";

export const AvatarCustomization = () => {
  // Pre-generated avatar URLs
  const avatarOptions = [
    "https://api.dicebear.com/7.x/avataaars/svg?seed=bravo",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=charlie",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=delta",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=echo",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=foxtrot",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=golf",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=hotel",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=india",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=juliet",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=kilo",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=lima",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=mike",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=november",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=oscar",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=papa",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=quebec",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=romeo",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=sierra",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=tango",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=uniform",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=victor",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=whiskey",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=xray",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=yankee",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=zulu",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=phoenix",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=dragon",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=unicorn",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=griffin",
  ];

  const [selectedAvatar, setSelectedAvatar] = useState(avatarOptions[0]);

  const handleSave = () => {
    console.log("✅ Selected Avatar:", selectedAvatar);
    // 👉 here you can make an API call to update user profile avatar
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4 text-center">
        🎨 Pick Your Avatar
      </h2>

      {/* Preview */}
      <div className="flex justify-center mb-6">
        <div className="w-32 h-32 rounded-full border-4 border-purple-500 shadow-md overflow-hidden bg-gray-100">
          <img
            src={selectedAvatar}
            alt="Selected Avatar"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Avatar options */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        {avatarOptions.map((url, idx) => (
          <img
            key={idx}
            src={url}
            alt={`avatar-${idx}`}
            className={`w-20 h-20 rounded-full cursor-pointer border-2 transition 
              ${
                selectedAvatar === url
                  ? "border-purple-600 scale-110"
                  : "border-transparent"
              }`}
            onClick={() => setSelectedAvatar(url)}
          />
        ))}
      </div>

      {/* Save Button */}
      <div className="flex justify-center">
        <button
          onClick={handleSave}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md shadow-md transition"
        >
          Save Avatar
        </button>
      </div>
    </div>
  );
};
