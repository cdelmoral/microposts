module.exports = function(grunt) {

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Automatically load required Grunt tasks
  require('jit-grunt')(grunt);

  require('jit-grunt')(grunt, {
    express: 'grunt-express-server'
  });

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    watch: {
      express: {
        files: ['src/**/*.ts', 'src/**/*.js', 'bin/www'],
        tasks: ['copy:dist', 'ts', 'express:dev'],
        options: {
          spawn: false
        }
      }
    },

    env: { dev: { src: '.env.dev.json' } },

    express: {
      dev: {
        options: {
          port: 8000,
          script: 'bin/www',
          node_env: 'development',
          debug: true
        }
      },
      test: {
        options: {
          port: 8001,
          script: 'bin/www',
          node_env: 'development'
        }
      }
    },

    ts: {
      app: {
        files: [{
          src: ["src/\*\*/\*.ts", "src/\*\*/\*.js", "!src/.baseDir.ts"],
          dest: "./dist"
        }],
        options: {
          module: "commonjs",
          target: "es6",
          sourceMap: false,
          allowJs: true
        }
      }
    },

    clean: {
        dist: 'dist'
    },

    copy: {
        dist: {
            expand: true,
            cwd: 'src/',
            dest: 'dist',
            src: ['**/*.ejs']
        },
    }
  });

  grunt.registerTask('serve', [
    'clean:dist',
    'copy:dist',
    'ts',
    'env:dev',
    'express:dev',
    'watch:express'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'copy:dist',
    'ts'
  ]);
};
