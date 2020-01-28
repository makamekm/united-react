import React from 'react';
import paper from 'paper';
import ReactDOM from 'react-dom';
import html2canvas from 'html2canvas';
import { observable } from 'mobx';
import { IRootService } from './root-sevice.interface';
import { UmdComponent } from '../components/umd-component';
import { provider, toValue } from 'react-ioc';
import { UmdServices } from '../components/umd-services';

export class CompilerService implements IRootService {
  @observable public loadingServices = true;
  private promiseLoadServices: Promise<void>;
  private services = [];
  private componentCache: {
    [path: string]: any;
  } = {};
  private ServiceContainer;

  public useHook() { }

  rootContainer = services =>
    provider(...services)(({ children }: { children: any }) => {
      return <div>{children}</div>;
    });

  loadServices = async () => {
    this.loadingServices = true;
    this.promiseLoadServices = new Promise(async r => {
      const rawServices = await UmdServices('/api/compile/services');
      this.services = rawServices.map(clazz => {
        const value = new clazz();
        return [clazz, toValue(value), value];
      });
      this.ServiceContainer = this.rootContainer(this.services);
      r();
    });
    await this.promiseLoadServices;
    this.loadingServices = false;
  };

  async checkServicesBeingLoaded() {
    if (!this.promiseLoadServices) {
      await this.loadServices();
    } else {
      await this.promiseLoadServices;
    }
  }

  async getComponent(path: string) {
    if (this.componentCache[path]) {
      return this.componentCache[path];
    } else {
      const Component = await UmdComponent(`/api/compile/component?path=${path}`, path);
      this.componentCache[path] = Component;
      return Component;
    }
  }

  public async renderElement(path: string, width: number = 200, props: React.Props<any> = {}) {
    const element = document.createElement('div');

    // Configuration
    // element.style.width = width + 'px';
    // element.style.height = height + 'px';
    await this.checkServicesBeingLoaded();
    const Component = await this.getComponent(path);

    ReactDOM.render(
      <this.ServiceContainer>
        <Component {...props} />
      </this.ServiceContainer>,
      element,
      async () => {
        document.body.appendChild(element);
        try {
          const canvas = await html2canvas(element);
          const raster = new paper.Raster(canvas.toDataURL());
          raster.position = paper.view.center;
          // console.log(canvas.clientWidth, canvas.clientHeight);
          raster.scale(1 / window.devicePixelRatio);
          // raster.shadowColor = new paper.Color(0, 0, 0, 0.5);
          // raster.shadowBlur = 8;
          // raster.shadowOffset = new paper.Point(0, 5);
          // raster.scale(100 / canvas.width);
        } catch (error) {
          console.error(error);
        } finally {
          document.body.removeChild(element);
          ReactDOM.unmountComponentAtNode(element);
        }
      }
    );
  }
}
