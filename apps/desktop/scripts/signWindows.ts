import { $ } from "bun";
import { existsSync, readdirSync } from "@toonflow/file";
import { join } from "node:path";

// ACT: 证书只从环境变量读取，不写入仓库；未配置时打包照常进行，只是不签名。
const certificatePath = process.env.CAREFREE_SIGN_PFX;
const certificatePassword = process.env.CAREFREE_SIGN_PASSWORD;

export function windowsSigningConfigured() {
  return !!certificatePath;
}

function resolveSignTool() {
  if (process.env.SIGNTOOL_PATH) {
    if (!existsSync(process.env.SIGNTOOL_PATH)) throw new Error(`SIGNTOOL_PATH 指向的文件不存在：${process.env.SIGNTOOL_PATH}`);
    return process.env.SIGNTOOL_PATH;
  }
  const kitsRoot = join(process.env["ProgramFiles(x86)"] ?? process.env.ProgramFiles ?? "", "Windows Kits", "10", "bin");
  if (existsSync(kitsRoot)) {
    const versions = readdirSync(kitsRoot, { withFileTypes: true })
      .filter(entry => entry.isDirectory())
      .map(entry => entry.name)
      .sort((left, right) => right.localeCompare(left, undefined, { numeric: true }));
    for (const version of versions) {
      const candidate = join(kitsRoot, version, "x64", "signtool.exe");
      if (existsSync(candidate)) return candidate;
    }
  }
  throw new Error("未找到 signtool.exe，请安装 Windows SDK 或通过 SIGNTOOL_PATH 指定路径。");
}

export async function signWindowsFiles(files: string[]) {
  if (!certificatePath || !files.length) return;
  if (!existsSync(certificatePath)) throw new Error(`代码签名证书不存在：${certificatePath}`);
  const signTool = resolveSignTool();
  const timestampUrl = process.env.CAREFREE_SIGN_TIMESTAMP_URL ?? "http://timestamp.digicert.com";
  const arguments_ = ["sign", "/fd", "SHA256", "/tr", timestampUrl, "/td", "SHA256", "/f", certificatePath];
  if (certificatePassword) arguments_.push("/p", certificatePassword);
  await $`${signTool} ${arguments_} ${files}`;
  await $`${signTool} verify /pa ${files}`;
  console.log(`代码签名完成：${files.length} 个文件。`);
}
