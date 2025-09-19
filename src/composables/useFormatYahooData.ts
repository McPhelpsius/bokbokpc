export function useEliminateEmptyValues (data: []) {
  return data.reduce((accumulator: object, current: object | []) => {
            if (current) {
                return { ...accumulator, ...current }
            }
        }, {})
}

export function filterOnlyValidObjects (array: []) {
   return array.filter((item: any) => typeof item === "object");
}