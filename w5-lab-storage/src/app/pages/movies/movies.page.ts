// src/app/pages/movies/movies.page.ts
import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.page.html',
  styleUrls: ['./movies.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule],
})
export class MoviesPage implements OnInit {
  movieName: string = '';
  releaseYear: string = '';
  movies: { name: string; year: string }[] = [];
  errorMessage: string = '';
  isEditModalOpen: boolean = false;
  editMovieName: string = '';
  editReleaseYear: string = '';
  editIndex: number = -1;

  constructor(private storageService: StorageService) {}

  async ngOnInit() {
    await this.loadMovies();
  }

  async addMovie() {
    if (this.movieName && this.releaseYear) {
      const movie = { name: this.movieName, year: this.releaseYear };
      this.movies.push(movie);
      try {
        await this.storageService.set('movies', this.movies);
        this.movieName = '';
        this.releaseYear = '';
        this.errorMessage = '';
      } catch (error) {
        console.error('Error adding movie:', error);
        this.errorMessage = 'Error adding movie. Please try again.';
      }
    } else {
      this.errorMessage = 'Movie name and release year are required.';
    }
  }

  async loadMovies() {
    try {
      const storedMovies = await this.storageService.get('movies');
      if (storedMovies) {
        this.movies = storedMovies;
      }
      this.errorMessage = '';
    } catch (error) {
      console.error('Error loading movies:', error);
      this.errorMessage = 'Error loading movies. Please try again.';
    }
  }

  async deleteMovie(index: number) {
    this.movies.splice(index, 1);
    try {
      await this.storageService.set('movies', this.movies);
      this.errorMessage = '';
    } catch (error) {
      console.error('Error deleting movie:', error);
      this.errorMessage = 'Error deleting movie. Please try again.';
    }
  }

  openEditModal(movie: { name: string; year: string }, index: number) {
    this.editMovieName = movie.name;
    this.editReleaseYear = movie.year;
    this.editIndex = index;
    this.isEditModalOpen = true;
  }

  closeEditModal() {
    this.isEditModalOpen = false;
    this.editMovieName = '';
    this.editReleaseYear = '';
    this.editIndex = -1;
  }

  async saveEdit() {
    if (this.editMovieName && this.editReleaseYear) {
      this.movies[this.editIndex] = { name: this.editMovieName, year: this.editReleaseYear };
      try {
        await this.storageService.set('movies', this.movies);
        this.closeEditModal();
        this.errorMessage = '';
      } catch (error) {
        console.error('Error saving movie:', error);
        this.errorMessage = 'Error saving movie. Please try again.';
      }
    } else {
      this.errorMessage = 'Movie name and release year are required.';
    }
  }
}