import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PokeService } from '../../services/pokeservice';

/**
 * Provides a search interface for looking up Pokémon by name.
 * Binds the input field to a local string and triggers a search
 * using the PokeService when the user clicks the search button.
 */
@Component({
  selector: 'app-search',
  imports: [FormsModule],
  templateUrl: './search.html',
  styleUrl: './search.css'
})
export class Search {

  /**
   * Holds the current value of the search input.
   * Bound to the input field via ngModel.
   */
  searchValue = "";

  constructor(private pokeService: PokeService) {}

  /**
   * Invokes the PokeService to search for a Pokémon by name.
   * Called when the user clicks the search button.
   */
  searchForPokemon() {
    this.pokeService.searchPokemon(this.searchValue);
  }
}
