import { ElementRef, Renderer2, SimpleChanges } from '@angular/core';

import { Type } from './type';

describe('Type', () => {
  let element: ElementRef<HTMLDivElement>;
  let renderer: jasmine.SpyObj<Renderer2>;
  let directive: Type;

  beforeEach(() => {
    element = new ElementRef(document.createElement('div'));
    renderer = jasmine.createSpyObj<Renderer2>('Renderer2', ['setStyle']);
    directive = new Type(element, renderer);
  });

  function applyType(type: string): void {
    directive.type = type;
    const changes: SimpleChanges = {
      type: { currentValue: type, previousValue: undefined, firstChange: true, isFirstChange: () => true }
    };
    directive.ngOnChanges(changes);
  }

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('should apply the mapped color for a known type', () => {
    applyType('fire');
    expect(renderer.setStyle).toHaveBeenCalledWith(element.nativeElement, 'color', '#EE8130');
  });

  it('should default to black for an unknown type', () => {
    applyType('unknown');
    expect(renderer.setStyle).toHaveBeenCalledWith(element.nativeElement, 'color', '#000000');
  });

  it('should normalize case and whitespace before looking up the color', () => {
    applyType('  Fire  ');
    expect(renderer.setStyle).toHaveBeenCalledWith(element.nativeElement, 'color', '#EE8130');
  });

  it('should not set a style when the type input did not change', () => {
    directive.ngOnChanges({});
    expect(renderer.setStyle).not.toHaveBeenCalled();
  });
});
