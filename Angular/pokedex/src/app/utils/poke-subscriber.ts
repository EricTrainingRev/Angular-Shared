import { Directive, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

/**
 * Abstract base directive for components that manage a single RxJS subscription.
 * Provides a standardized implementation of the `OnDestroy` lifecycle hook
 * to automatically unsubscribe when the component is destroyed.
 * 
 * Intended to be extended by components that subscribe to observables.
 */
@Directive()
export abstract class PokeSubscriber implements OnDestroy {

  /**
   * Holds the active subscription instance.
   * Subclasses should assign their observable subscription to this property.
   */
  protected subscription?: Subscription;

  /**
   * Automatically called when the component is destroyed.
   * Unsubscribes from the active subscription to prevent memory leaks.
   */
  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
