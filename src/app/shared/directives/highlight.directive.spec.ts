import { ElementRef } from '@angular/core';
import { HighlightDirective } from './highlight.directive';

describe('HighlightDirective', () => {
  let host: HTMLElement;
  let directive: HighlightDirective;

  beforeEach(() => {
    host = document.createElement('div');
    directive = new HighlightDirective(new ElementRef(host));
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('should set background color on mouseenter using default color', () => {
    // default color defined in directive
    directive.onMouseEnter();
    expect(host.style.backgroundColor).toBe('rgb(234, 250, 241)');
  });

  it('should set background color on mouseenter using provided color', () => {
    directive.color = 'rgb(255, 0, 0)';
    directive.onMouseEnter();
    expect(host.style.backgroundColor).toBe('rgb(255, 0, 0)');
  });

  it('should clear background color on mouseleave', () => {
    directive.color = 'blue';
    directive.onMouseEnter();
    expect(host.style.backgroundColor).toBe('blue');
    directive.onMouseLeave();
    expect(host.style.backgroundColor).toBe('');
  });
});
