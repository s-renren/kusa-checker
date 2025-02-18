import getContributions from "./contributions/main.ts";

const kusa = async (): Promise<string> => {
  const res: number[] = await getContributions();

  if (res[0] === 0) {
    return "No contributions";
  } else {
    if (res[0] === 1) {
      return `${res[0].toString()} contribution`;
    } else {
      return `${res[0].toString()} contributions`;
    }
  }
};

export default kusa;
