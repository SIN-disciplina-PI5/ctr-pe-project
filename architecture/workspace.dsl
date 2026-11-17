workspace "MaqControl" "Modelo C4 do MaqControl, sistema de gestão de manutenção de ativos com assistente de IA" {
    !identifiers hierarchical
    !docs docs
    !adrs docs/adrs

    model {
        !include c4_layers/c1_context.dsl
        !include c4_layers/relationships.dsl
        !include c4_layers/c4_deployments/local.dsl
        !include c4_layers/c4_deployments/producao.dsl
    }
    views {
        !include c4_layers/views.dsl
        !include c4_layers/styles.dsl
    }
    configuration {
        scope softwaresystem
    }
}
