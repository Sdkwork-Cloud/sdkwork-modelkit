use sdkwork_modelkit_standalone_gateway::build_router;

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt()
        .with_env_filter(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| tracing_subscriber::EnvFilter::new("info")),
        )
        .init();

    let bind_address = std::env::var("SDKWORK_MODELKIT_APPLICATION_PUBLIC_INGRESS_BIND").expect(
        "SDKWORK_MODELKIT_APPLICATION_PUBLIC_INGRESS_BIND must be set from a topology profile env",
    );
    let app = build_router()
        .await
        .expect("modelkit standalone-gateway bootstrap failed");
    let listener = tokio::net::TcpListener::bind(&bind_address)
        .await
        .expect("bind modelkit standalone-gateway listener failed");
    tracing::info!("sdkwork-modelkit-standalone-gateway listening on {bind_address}");
    axum::serve(listener, app)
        .await
        .expect("serve modelkit standalone-gateway failed");
}
