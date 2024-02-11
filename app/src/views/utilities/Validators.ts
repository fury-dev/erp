export const getIdFromUrl = (pathname: string) => {
  const splitPath = pathname.split('/');
  const id = splitPath[splitPath.length - 1];
  //   if (isValidObjectId(id)) {
  //     return id;
  //   } else {
  //     throw new Error('string not an ObjectId');
  //   }
  return id;
};
