const Avatar = require("avatar-builder");
const { promises: fs } = require("fs");
const path = require("path");

async function avatarGenerator() {
  const avatar = Avatar.githubBuilder(128);
  const avatarFile = await avatar.create("gabriel");
  const avatarName = `${Date.now()}.png`;
  const avatarPath = path.join("tmp", avatarName);
  const publicPath = path.join("public", "images", avatarName);
  await fs.writeFile(avatarPath, avatarFile);
  await fs.copyFile(avatarPath, publicPath);
  await fs.unlink(avatarPath);
  return avatarName;
}

module.exports = avatarGenerator;
