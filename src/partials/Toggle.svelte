<script>
  import Switch from "svelte-switch"
  import {createEventDispatcher} from "svelte"

  export let value

  const dispatch = createEventDispatcher()

  const onChange = e => {
    value = e.detail.checked
    dispatch("change", value)
  }
</script>

<Switch
  checked={value}
  on:change={onChange}
  onColor="#ccc"
  offColor="#ccc"
  onHandleColor="#4512a3"
  handleDiameter={20}
  unCheckedIcon={false}
  boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
  activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
  height={20}
  width={36}>
  <span slot="checkedIcon" />
  <span slot="unCheckedIcon" />
</Switch>
