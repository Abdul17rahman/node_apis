const PAGE = 1;
const PAGE_LIMIT = 10;

export default function paginate(page, limit, data = []) {
  const currentPage = Math.abs(page) || PAGE;
  const docLimit = Math.abs(limit) || PAGE_LIMIT;

  // const totalPages = Math.ceil(data.length / docLimit);

  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / docLimit);

  // If the requested page is greater than the total pages, return an empty array
  if (currentPage > totalPages) {
    return [];
  }

  const skip = (currentPage - 1) * docLimit;

  return {
    data: data.slice(skip, skip + docLimit),
    meta: {
      currentPage,
      quotesPerPage: docLimit,
      totalPages,
      totalQuotes: totalItems,
    },
  };
}
