import { makeInstaller } from "@z-element/utils";
import components from "./components";
import "@z-element/theme";

const installer = makeInstaller(components);

export * from "@z-element/components";
export default installer;
