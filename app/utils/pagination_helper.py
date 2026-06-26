
def paginate_response(pagination, data):
    return {
        "data": data,
        "pagination": {
            "page":        pagination.page,
            "per_page":    pagination.per_page,
            "total_pages": pagination.pages,
            "total_items": pagination.total,
            "has_next":    pagination.has_next,
            "has_prev":    pagination.has_prev,
            "next_page":   pagination.next_num,
            "prev_page":   pagination.prev_num
        }
    }