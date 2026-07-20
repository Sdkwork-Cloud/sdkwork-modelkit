use sdkwork_utils_rust::SdkWorkResourceData;

pub fn resource_data<T>(item: T) -> SdkWorkResourceData<T> {
    SdkWorkResourceData { item }
}

pub fn list_page<T>(
    items: Vec<T>,
    total_items: i64,
    offset: i64,
    limit: i64,
) -> sdkwork_utils_rust::SdkWorkPageData<T> {
    sdkwork_utils_rust::SdkWorkPageData {
        items,
        page_info: sdkwork_utils_rust::PageInfo {
            mode: sdkwork_utils_rust::PageMode::Offset,
            page: Some((offset / limit.max(1)) as i32 + 1),
            page_size: Some(limit as i32),
            total_items: Some(total_items.to_string()),
            total_pages: Some(((total_items + limit.max(1) - 1) / limit.max(1)) as i32),
            next_cursor: None,
            has_more: Some(offset + limit < total_items),
        },
    }
}
