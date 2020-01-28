import paper from 'paper';

export interface IPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface IComponent {
  props: any;
  children: IComponent[];
  paper?: paper.Group;
}

export interface IView {
  children: IComponent[];
}
