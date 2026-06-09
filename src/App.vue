<!-- TOOD BUG: Панель нужно обнавлять чаще. Сейчас только при смене проекта, то есть при изминении панель не будет изминятся -->
<!-- TODO FEATURE: Добавить логику на удалённые сущности -->
<template>
  <n-config-provider :locale="ruLocale" :date-locale="dateRuRU" :theme-overrides="theme">
    <n-modal-provider>
      <n-dialog-provider>
        <n-message-provider>
          <router-view />
        </n-message-provider>
      </n-dialog-provider>
    </n-modal-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
  import { ruRU, dateRuRU, NConfigProvider, type GlobalThemeOverrides } from 'naive-ui'
  import './style.css'

  const theme: GlobalThemeOverrides = {
    Input: {
      common: {
        primaryColorHover: '#2f9acc',
        primaryColorPressed: '2f9acc',
      },
    },
    Dialog: {
      iconColor: '#2f9acc',
    },
    Select: {
      peers: {
        InternalSelection: {
          borderHover: '#2f9acc',
          borderFocus: '#2f9acc',
          boxShadowHover: '#2f9acc',
          caretColor: '#2f9acc',
          borderActive: '#2f9acc',
          loadingColor: '#2f9acc',
        },
      },
      common: {
        hoverColor: '#2f9acc',
        primaryColorHover: '#2f9acc',
        primaryColorPressed: '2f9acc',
        tabColor: '#2f9acc',
        infoColorHover: '#2f9acc',
        inputColor: '#2f9acc',
        primaryColor: '#2f9acc',
        closeColorHover: '#2f9acc',
        actionColor: '#2f9acc',
        baseColor: '#2f9acc',
        borderColor: '#2f9acc',
        bodyColor: '#2f9acc',
        tableColor: '#2f9acc',
        codeColor: '#2f9acc',
        tagColor: '#2f9acc',
      },
    },
  }

  const ruLocale = {
    ...ruRU,
  }
</script>

<style lang="css">
  #app {
    height: 100%;
    width: 100%;
  }

  .n-config-provider {
    height: 100%;
  }
</style>
