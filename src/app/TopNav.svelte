<script lang="ts">
  import {onMount} from "svelte"
  import {theme, appName} from "src/partials/state"
  import Anchor from "src/partials/Anchor.svelte"
  import {menuIsOpen} from "src/app/state"
  import {newNotifications} from "src/app/state"

  // const logoUrl = import.meta.env.VITE_LOGO_URL || "/images/logo.png"
  const logoUrl = "https://i.imgur.com/mSV5rQ7.png"
  const toggleMenu = () => menuIsOpen.update(x => !x)
  const toggleTheme = () => theme.update(t => (t === "dark" ? "light" : "dark"))

  onMount(() => {
    document.querySelector("html").addEventListener("click", e => {
      if (!(e.target as any).matches(".fa-bars")) {
        menuIsOpen.set(false)
      }
    })
  })
</script>

<div
  class="fixed top-0 z-10 flex h-16 w-full items-center justify-between border-b
            border-gray-6 navbar-bg p-4 shadow-xl text-gray-2">
  <div class="fa fa-bars fa-2xl -m-6 cursor-pointer p-6 lg:hidden" on:click={toggleMenu} />
  <div class="flex items-center gap-4">
    <Anchor
      type="unstyled"
      href="/"
      class="flex items-center gap-2">
      <img alt="Agora Logo" src={logoUrl} class="w-8" />
      <h1 class="roboto text-3xl">Agora</h1>
    </Anchor>
    <!-- <i class="fa fa-lightbulb -m-4 cursor-pointer p-4 text-lg" on:click={toggleTheme} /> -->
  </div>
  {#if $newNotifications}
    <div class="absolute top-4 left-12 h-2 w-2 rounded bg-accent lg:hidden" />
  {/if}
</div>
