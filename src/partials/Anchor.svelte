<script>
  import cx from "classnames"
  import {navigate} from "svelte-routing"
  import {switcher} from "hurdak/lib/hurdak"
  import {killEvent as _killEvent} from "src/util/html"
  import {createEventDispatcher} from "svelte"

  export let stopPropagation = false
  export let killEvent = false
  export let external = false
  export let loading = false
  export let type = "anchor"
  export let href = null

  const dispatch = createEventDispatcher()

  $: _href = external ? href : null
  $: target = external ? "_blank" : null

  let className

  $: className = cx(
    $$props.class,
    "cursor-pointer transition-all",
    {"opacity-50": loading},
    switcher(type, {
      anchor: "underline",
      button:
        "py-2 px-4 rounded bg-input text-accent whitespace-nowrap border border-solid border-gray-6 hover:bg-input-hover",
      "button-circle":
        "w-10 h-10 flex justify-center items-center rounded-full bg-input text-accent whitespace-nowrap border border-solid border-gray-6 hover:bg-input-hover",
      "button-circle-dark":
        "w-10 h-10 flex justify-center items-center rounded-full bg-gray-8 text-white whitespace-nowrap border border-solid border-gray-7",
      "button-accent":
        "py-2 px-4 rounded bg-accent text-white whitespace-nowrap border border-solid border-accent-light hover:bg-accent-light",
    })
  )

  const onClick = e => {
    if (killEvent) {
      _killEvent(e)
    }

    if (stopPropagation) {
      e.stopPropagation()
    }

    if (href && !external) {
      navigate(href)
    }

    dispatch("click", e)
  }
</script>

<a class={className} on:click={onClick} href={_href} {target}>
  <slot />
</a>
