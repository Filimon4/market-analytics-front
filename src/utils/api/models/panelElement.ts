
export interface IPanelElement {
  name: string,
  code: string,
  children: Array<{
    name: string,
    code: string
  }>
}
