use sqlx::AnyPool;

pub async fn seed_default_catalog(pool: &AnyPool) -> Result<(), String> {
    let seeds: &[(&str, &str, &str)] = &[
        (
            "skillhub",
            "Automation",
            r#"{"id":1,"name":"Self-Improving Agent","author":"@pskoett","downloads":"432k","rating":3.6,"type":"Automation","updated":"1d ago","desc":"Captures learnings, errors, and corrections to enable continuous improvement.","installedAgents":[],"icon":"Box","schemaType":"REST API","authType":"None","permissions":["Memory Access","Self Reflection"],"endpoints":[{"method":"POST","path":"/v1/memory/learn","desc":"Store a learning or correction"}]}"#,
        ),
        (
            "skillhub",
            "Security",
            r#"{"id":2,"name":"Skill Vetter","author":"@spclaudehome","downloads":"237k","rating":1.1,"type":"Security","updated":"1d ago","desc":"Security-first skill vetting for AI agents.","installedAgents":[],"icon":"Shield","schemaType":"GraphQL","authType":"OAuth 2.0","permissions":["Read Repositories"],"endpoints":[{"method":"POST","path":"/graphql","desc":"Execute Git operations"}]}"#,
        ),
        (
            "shop",
            "api-credits",
            r#"{"id":"api-credits-100","name":"API Credits 100","type":"virtual","price":9.99,"category":"api-credits","description":"100 API credits for Modelkit relay usage.","imageUrl":"💳","badge":"Popular","couponFormat":"MK-API-CRED-XXXX-XXXX-XXXX"}"#,
        ),
        (
            "shop",
            "keys",
            r#"{"id":"workspace-pro","name":"Workspace Pro License","type":"virtual","price":29.99,"category":"keys","description":"Advanced workspace tooling license.","imageUrl":"🔑","badge":"New","couponFormat":"MK-WS-PRO-XXXX-XXXX-XXXX"}"#,
        ),
        (
            "shop",
            "hardware",
            r#"{"id":"relay-node-mini","name":"Modelkit Relay Node Mini","type":"physical","price":499,"category":"hardware","description":"Compact edge relay appliance for local model routing.","imageUrl":"🖥️","features":["Dual NIC","Silent fanless design"]}"#,
        ),
        (
            "prompts",
            "video",
            r#"{"id":"5","type":"video","title":"Time-lapse Bloom","content":"Macro time-lapse of an orchid blooming on a dark background.","views":800,"author":"NatureLens"}"#,
        ),
        (
            "prompts",
            "music",
            r#"{"id":"4","type":"music","title":"Epic Orchestral Trailer","content":"Fast-paced epic orchestral track with brass, strings, and choir climax.","views":3100,"author":"ComposerX"}"#,
        ),
        (
            "software",
            "Developer Tools",
            r#"{"id":"modelkit-cli","name":"Modelkit CLI","vendor":"SDKWork","version":"0.1.0","description":"Command-line tooling for relay and catalog management.","platform":"cross-platform","rating":4.7,"downloads":"8k"}"#,
        ),
        (
            "repos",
            "Featured",
            r#"{"id":"sdkwork-modelkit","name":"sdkwork-modelkit","owner":"SDKWork","description":"Standalone Modelkit application repository.","stars":128,"language":"TypeScript","updated":"2026-07-01"}"#,
        ),
        (
            "prompts",
            "agent",
            r#"{"id":"2","type":"agent","title":"Expert Code Reviewer","content":"You are a senior principal engineer. Review code for security, performance, and best practices.","views":8930,"author":"DevOpsPro"}"#,
        ),
        (
            "prompts",
            "image",
            r#"{"id":"1","type":"image","title":"Cyberpunk Cityscape","content":"A futuristic city street at night, neon lights, rain-slicked roads, cinematic lighting.","views":1250,"author":"NeonDreamer"}"#,
        ),
        (
            "prompts",
            "text",
            r#"{"id":"3","type":"text","title":"Creative Story Generator","content":"Write a short story about a time traveler who keeps arriving late to historically significant events.","views":420,"author":"WriterBot"}"#,
        ),
        (
            "relay",
            "Public",
            r#"{"id":"relay-openai-proxy","name":"OpenAI Proxy","port":11434,"status":"running","providers":["openai"],"protocols":["openai","anthropic"],"region":"local","visibility":"public"}"#,
        ),
        (
            "plugins",
            "Dev Tools",
            r#"{"id":1,"name":"SDKWork MCP Bridge","author":"@sdkwork","downloads":"12k","rating":4.8,"type":"Dev Tools","updated":"1d ago","desc":"Bridge Modelkit workspace tools to MCP hosts.","installedAgents":[],"icon":"Plug","schemaType":"REST API","authType":"Bearer","permissions":["Tool Routing"],"endpoints":[{"method":"POST","path":"/v1/tools/invoke","desc":"Invoke routed tool"}]}"#,
        ),
        (
            "news",
            "Security",
            r#"{"id":1,"title":"Modelkit security baseline","excerpt":"SDKWork standard envelopes and IAM integration guidance.","content":"Modelkit now ships catalog APIs, IAM auth, and Drive-backed artifact publishing.","author":"SDKWork","date":"2026-07-01","category":"Security","image":"🛡️","hot":true,"views":1280}"#,
        ),
    ];

    for (domain, category, payload) in seeds {
        let item_id = format!(
            "seed-{domain}-{}",
            category.to_lowercase().replace(' ', "-")
        );
        sqlx::query(
            r#"
            INSERT INTO mk_catalog_item (
                item_id, domain, category, payload, tenant_id, organization_id, created_by, updated_by
            ) VALUES ($1, $2, $3, $4, '0', '0', 'system', 'system')
            ON CONFLICT(item_id) DO NOTHING
            "#,
        )
        .bind(&item_id)
        .bind(domain)
        .bind(category)
        .bind(payload)
        .execute(pool)
        .await
        .map_err(|error| error.to_string())?;
    }

    Ok(())
}
