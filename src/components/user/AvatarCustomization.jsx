import React, { useState } from "react";
export const AvatarCustomization = () => {
    const skinColors = ["tanned", "yellow", "pale", "light", "brown", "darkBrown", "black"];
  const eyes = ["default", "happy", "wink", "squint", "surprised", "cry"];
  const hairstyles = ["shortHair", "longHair", "hat", "bun", "curly", "shaggyMullet"];

  const [avatarOptions, setAvatarOptions] = useState({
    seed: "patel", // default username or random
    skinColor: "light",
    eyes: "default",
    hair: "shortHair",
  });

  // Build URL dynamically from options
  const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarOptions.seed}&skinColor=${avatarOptions.skinColor}&eyes=${avatarOptions.eyes}&top=${avatarOptions.hair}`;

  const handleChange = (key, value) => {
    setAvatarOptions({ ...avatarOptions, [key]: value });
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">🎨 Customize Your Avatar</h2>

      {/* Avatar Preview */}
      <div className="flex justify-center mb-6">
        <img
          src={avatarUrl}
          alt="Custom Avatar"
          className="w-32 h-32 rounded-full border-4 border-purple-500 shadow-md"
        />
      </div>

      {/* Controls */}
      <div className="space-y-4">
        {/* Skin Color */}
        <div>
          <label className="block text-sm font-medium mb-1">Skin Color</label>
          <select
            value={avatarOptions.skinColor}
            onChange={(e) => handleChange("skinColor", e.target.value)}
            className="w-full p-2 rounded-md border bg-gray-100 dark:bg-gray-800"
          >
            {skinColors.map((color) => (
              <option key={color} value={color}>
                {color}
              </option>
            ))}
          </select>
        </div>

        {/* Eyes */}
        <div>
          <label className="block text-sm font-medium mb-1">Eyes</label>
          <select
            value={avatarOptions.eyes}
            onChange={(e) => handleChange("eyes", e.target.value)}
            className="w-full p-2 rounded-md border bg-gray-100 dark:bg-gray-800"
          >
            {eyes.map((eye) => (
              <option key={eye} value={eye}>
                {eye}
              </option>
            ))}
          </select>
        </div>

        {/* Hair */}
        <div>
          <label className="block text-sm font-medium mb-1">Hairstyle</label>
          <select
            value={avatarOptions.hair}
            onChange={(e) => handleChange("hair", e.target.value)}
            className="w-full p-2 rounded-md border bg-gray-100 dark:bg-gray-800"
          >
            {hairstyles.map((hair) => (
              <option key={hair} value={hair}>
                {hair}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Save button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={() => console.log("Final Avatar URL:", avatarUrl)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md shadow-md transition"
        >
          Save Avatar
        </button>
      </div>
    </div>
  )
}
