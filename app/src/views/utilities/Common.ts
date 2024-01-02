export const onChange = <T>(e: any, key: any, setValue: React.Dispatch<React.SetStateAction<T>>) => {
  setValue((prev: T) => ({
    ...prev,
    [key]: e
  }));
};
